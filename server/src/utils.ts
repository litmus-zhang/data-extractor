export const stripFirstFence = (text: string) => {
    const m = text.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
    return m ? m[1] : text;
}