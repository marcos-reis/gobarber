import { ObjectID } from 'mongodb';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class FakeNotificationsRepository implements INotificationsRepository {
  private Notifications: Notification[] = [];

  public async create({
    recipient_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(Notification, { id: new ObjectID(), recipient_id, content });

    await this.Notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
