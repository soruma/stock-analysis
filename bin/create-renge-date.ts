import * as fs from 'node:fs';

function writeWeekdaysToFile(startDate: string, endDate: string, outputPath: string): void {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('Invalid date format. Use YYYY-MM-DD.');
  }

  if (start > end) {
    throw new Error('Start date must be before end date.');
  }

  const writeStream = fs.createWriteStream(outputPath);
  writeStream.write('{\n  "inputArray": [\n');

  const currentDate = start;
  let isFirst = true;

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateString = `    { "date": "${currentDate.toISOString().split('T')[0]}" }`;
      if (!isFirst) {
        writeStream.write(',\n');
      } else {
        isFirst = false;
      }
      writeStream.write(dateString);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  writeStream.write('\n  ]\n}');
  writeStream.end();

  writeStream.on('finish', () => {
    console.log(`File written to ${outputPath}`);
  });

  writeStream.on('error', (err: NodeJS.ErrnoException) => {
    console.error('Error writing file:', err.message);
  });
}

const args: string[] = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: ts-node bin/create-renge-date.ts <startDate> <endDate> <outputPath>');
  console.error('Example: ts-node bin/create-renge-date.ts 2024-03-01 2024-03-20 output.json');
  process.exit(1);
}

const [startDate, endDate, outputPath] = args;

try {
  writeWeekdaysToFile(startDate, endDate, outputPath);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('An unexpected error occurred.');
  }
  process.exit(1);
}
