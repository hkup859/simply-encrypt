export const shuffle = (array: string[]): string[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex: number = Math.floor(Math.random() * (i + 1))
    if (array[i] !== undefined && array[randomIndex] !== undefined) [array[i], array[randomIndex]] = [array[randomIndex] as string, array[i] as string]
  }
  return array
}
