import path from 'node:path';
export const sortList = ['asc', 'desc'];

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMPORARY_FILE_DIR = path.resolve('temp');

export const SWAGGER_PATH = path.resolve('docs', 'swagger.json');
