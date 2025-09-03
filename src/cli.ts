import { program } from 'commander';
import run from './service';

program
  .option('--since <iso>', 'ISO date string to start from')
  .option('--lookback-min <min>', 'minutes to look back', (v) => parseInt(v, 10))
  .option('--dry-run', 'do not send notifications');

program.parse(process.argv);

const opts = program.opts();

run({ since: opts.since, lookbackMin: opts.lookbackMin, dryRun: opts.dryRun }).catch((err) => {
  console.error(err);
  process.exit(1);
});
