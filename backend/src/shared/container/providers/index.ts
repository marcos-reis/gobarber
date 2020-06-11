import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import IMailProvider from './MailProvider/models/IMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import ICacheProvider from './CacheProvider/models/ICacheProvider';

import BCriptHashProvider from './HashProvider/implementations/BCriptHashProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import HandlebarsMailProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';
import RedisCacheProvider from './CacheProvider/implementations/RedisCacheProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCriptHashProvider);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);
