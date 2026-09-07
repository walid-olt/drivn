import type { IStorageService, UploadFileOptions, UploadedFileResult } from '../../types/storage';
import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

// NOTE: should use S3 or other cloud storage in production, but I have no ⌛
export class LocalStorageService implements IStorageService {
	private readonly fallbackUploadDir: string;
	private readonly fallbackBaseUrl: string;

	constructor(fallbackUploadDir = './uploads', fallbackBaseUrl = '') {
		this.fallbackUploadDir = fallbackUploadDir;
		this.fallbackBaseUrl = fallbackBaseUrl;
	}

	/**
	 * Resolved lazily so tests (and deployment environments) can swap
	 * `UPLOAD_DIR` without re-instantiating the service.
	 */
	private resolveUploadDir(): string {
		return path.resolve(process.env.UPLOAD_DIR ?? this.fallbackUploadDir);
	}

	private resolveBaseUrl(): string {
		const configured = process.env.PUBLIC_UPLOAD_URL ?? this.fallbackBaseUrl;
		if (configured) return configured;
		return `${process.env.BACKEND_URL ?? 'http://localhost:3000'}/uploads`;
	}

	/**
	 * Prevents path traversal through untrusted filenames or keys.
	 */
	private assertSafeName(name: string): void {
		if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) {
			throw new Error(`Unsafe storage key: ${name}`);
		}
	}

	async save(file: UploadFileOptions): Promise<UploadedFileResult> {
		const uploadDir = this.resolveUploadDir();
		this.assertSafeName(file.filename);
		await fs.mkdir(uploadDir, { recursive: true });
		const targetPath = path.join(uploadDir, file.filename);
		if (Buffer.isBuffer(file.content)) {
			await fs.writeFile(targetPath, file.content);
		} else {
			await pipeline(file.content, createWriteStream(targetPath));
		}
		return {
			key: file.filename,
			url: `${this.resolveBaseUrl()}/${file.filename}`,
		};
	}

	async delete(key: string): Promise<void> {
		this.assertSafeName(key);
		const filePath = path.join(this.resolveUploadDir(), key);
		await fs.unlink(filePath);
	}

	async getStream(key: string): Promise<Readable> {
		this.assertSafeName(key);
		const filePath = path.join(this.resolveUploadDir(), key);
		return createReadStream(filePath);
	}
}

export const localStorageService = new LocalStorageService('./uploads');
