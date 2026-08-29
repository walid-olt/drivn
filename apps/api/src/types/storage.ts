import { Readable } from 'stream';

export interface UploadFileOptions {
	filename: string;
	mimeType: string;
	content: Buffer | Readable;
	destinationPath?: string;
}

export interface UploadedFileResult {
	key: string;
	url: string;
	size?: number;
}

export interface IStorageService {
	save(file: UploadFileOptions): Promise<UploadedFileResult>;
	delete(key: string): Promise<void>;
	getStream(key: string): Promise<Readable>;
}
