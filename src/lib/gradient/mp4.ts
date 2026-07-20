import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { render } from "./render";
import { applyAnim } from "./anim";
import { ASPECTS, type Anim, type Design } from "./types";

/* WebCodecs types aren't in every TS lib — keep these loose. */
type AnyCtor = { new (...a: unknown[]): unknown; isConfigSupported?: (c: unknown) => Promise<{ supported?: boolean }> };

function dims(design: Design, size: number) {
  const [aw, ah] = ASPECTS[design.aspect];
  const ar = aw / ah;
  let W = ar >= 1 ? size : Math.round(size * ar);
  let H = ar >= 1 ? Math.round(size / ar) : size;
  W -= W % 2; H -= H % 2; // h264 needs even dimensions
  return { W: Math.max(2, W), H: Math.max(2, H) };
}

export interface ExportResult { blob: Blob; ext: "mp4" | "webm" }

/** Render every frame and encode to MP4 (H.264 via WebCodecs); falls back to WebM. */
export async function exportVideo(design: Design, anim: Anim, onProgress?: (p: number) => void): Promise<ExportResult> {
  const { W, H } = dims(design, anim.size);
  const fps = anim.fps;
  const frames = Math.max(1, Math.round(anim.duration * fps));
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const g = globalThis as unknown as { VideoEncoder?: AnyCtor; VideoFrame?: AnyCtor };

  if (g.VideoEncoder && g.VideoFrame) {
    try {
      const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: W, height: H }, fastStart: "in-memory" });
      const bitrate = Math.min(20_000_000, Math.round(W * H * fps * 0.12));
      const candidates = ["avc1.640034", "avc1.640028", "avc1.4d0034", "avc1.42e01f"];
      let encoder: { configure: (c: unknown) => void; encode: (f: unknown, o?: unknown) => void; flush: () => Promise<void> } | null = null;
      for (const codec of candidates) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sup = await (g.VideoEncoder as any).isConfigSupported({ codec, width: W, height: H, bitrate, framerate: fps });
        if (sup?.supported) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          encoder = new (g.VideoEncoder as any)({ output: (chunk: unknown, meta: unknown) => muxer.addVideoChunk(chunk as never, meta as never), error: (e: unknown) => console.error(e) });
          encoder!.configure({ codec, width: W, height: H, bitrate, framerate: fps });
          break;
        }
      }
      if (encoder) {
        for (let i = 0; i < frames; i++) {
          render(ctx, applyAnim(design, anim, i / frames), W, H);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const frame = new (g.VideoFrame as any)(canvas, { timestamp: Math.round((i * 1e6) / fps), duration: Math.round(1e6 / fps) });
          encoder.encode(frame, { keyFrame: i % fps === 0 });
          frame.close();
          if (i % 2 === 0) { onProgress?.(i / frames); await new Promise((r) => setTimeout(r)); }
        }
        await encoder.flush();
        muxer.finalize();
        onProgress?.(1);
        return { blob: new Blob([muxer.target.buffer], { type: "video/mp4" }), ext: "mp4" };
      }
    } catch (e) { console.warn("WebCodecs export failed, falling back to WebM", e); }
  }

  // Fallback: MediaRecorder → WebM
  const stream = canvas.captureStream(fps);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12_000_000 });
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise<Blob>((res) => { rec.onstop = () => res(new Blob(chunks, { type: "video/webm" })); });
  rec.start();
  for (let i = 0; i < frames; i++) {
    render(ctx, applyAnim(design, anim, i / frames), W, H);
    onProgress?.(i / frames);
    await new Promise((r) => setTimeout(r, 1000 / fps));
  }
  rec.stop();
  onProgress?.(1);
  return { blob: await done, ext: "webm" };
}
