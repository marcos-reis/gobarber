import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailprovider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
