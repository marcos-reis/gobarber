import AppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import NotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppErrors';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointmentsRepository = new AppointmentsRepository();
    const notificationsRepository = new NotificationsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
    expect(appointment.user_id).toBe('user-id');
  });
  it('should not be able to create a new appointment in same date', async () => {
    const appointmentsRepository = new AppointmentsRepository();
    const notificationsRepository = new NotificationsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await appointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user-id ',
      date: new Date(2020, 4, 10, 13),
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    const appointmentsRepository = new AppointmentsRepository();
    const notificationsRepository = new NotificationsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(20, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user and provider', async () => {
    const appointmentsRepository = new AppointmentsRepository();
    const notificationsRepository = new NotificationsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'same-id',
        user_id: 'same-id',
        date: new Date(2020, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // should separate in 2 test to and use mockImplementaionOnce
  it('should not be able to create an appointment before 8am and after 6pm', async () => {
    const appointmentsRepository = new AppointmentsRepository();
    const notificationsRepository = new NotificationsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
      notificationsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
