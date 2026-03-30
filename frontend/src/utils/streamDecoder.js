export async function processStream(response, onChunk) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const pieces = chunk.split("\n\n").filter((s) => s !== "");

    for (const piece of pieces) {
      const jsonText = piece.startsWith("data: ")
        ? piece.slice("data: ".length)
        : piece;
      const parsed = JSON.parse(jsonText);
      onChunk(parsed.chunk);
    }
  }
}
