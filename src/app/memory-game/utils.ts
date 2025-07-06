export class MemoryGameUtils {
  static getIntegerRandomNumberBetween = (min: number, max: number): number => {
    return Math.ceil(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  static shuffleArrayOfNumbers = (inputArray: number[]): number[] => {
    const result: number[] = [];
    const uniqueIndices = new Set<number>();

    while (result.length < inputArray.length) {
      const randomIndex = MemoryGameUtils.getIntegerRandomNumberBetween(
        0,
        inputArray.length - 1
      );
      if (!uniqueIndices.has(randomIndex)) {
        result.push(inputArray[randomIndex]);
        uniqueIndices.add(randomIndex);
      }
    }

    return result;
  };
}
