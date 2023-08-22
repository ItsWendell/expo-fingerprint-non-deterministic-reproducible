import { createFingerprintAsync, diffFingerprintChangesAsync } from "@expo/fingerprint";
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const projectRoot = process.cwd();

const run = async () => {
    const previousFingerprint = await fs.readFile(path.join(projectRoot, 'fingerprint.json'), 'utf8').then(JSON.parse).catch(() => null);

    const newFingerprint = await createFingerprintAsync(projectRoot);

    // Write to JSON file
    await fs.writeFile(path.join(projectRoot, 'fingerprint.json'), JSON.stringify(newFingerprint, null, 2));

    if (previousFingerprint) {
        const diff = await diffFingerprintChangesAsync(previousFingerprint, projectRoot);

        console.log(JSON.stringify(diff, null, 2));
    } else {
        console.log('No previous fingerprint found. Skipping diff.');
    }
}

run();