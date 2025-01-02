import * as fs from 'node:fs';

type ExecuteParams = {
  startDate: Date;
  endDate: Date;
  outputPath: string;
};

type MarketOpenDays = {
  inputArray: {
    date: string;
  }[];
};

export const convertParams = (args: string[]): ExecuteParams => {
  if (args.length < 3) {
    throw new Error(
      'Usage: ts-node bin/create-renge-date.ts <startDate> <endDate> <outputPath>\n' +
        'Example: ts-node bin/create-renge-date.ts 2024-03-01 2024-03-20 output.json',
    );
  }

  const [startStr, endStr, outputPath] = args;

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid date format. Use YYYY-MM-DD.');
  }

  if (startDate > endDate) {
    throw new Error('Start date must be before end date.');
  }

  return {
    startDate,
    endDate,
    outputPath,
  };
};

export const marketOpenDays = (startDate: Date, endDate: Date): MarketOpenDays => {
  const result: MarketOpenDays = {
    inputArray: [],
  };
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      result.inputArray.push({ date: currentDate.toISOString().split('T')[0] });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

/**
 * Writes JSON data to a file.
 * @param filePath - The path to the output file.
 * @param data - The JSON data to write.
 */
export const writeJsonToFile = (filePath: string, data: MarketOpenDays): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`JSON data has been written to ${filePath}`);
  } catch (error) {
    console.error('Error writing JSON to file:', error);
  }
};

if (require.main === module) {
  const params = convertParams(process.argv.slice(2));
  const data = marketOpenDays(params.startDate, params.endDate);
  writeJsonToFile(params.outputPath, data);
}
