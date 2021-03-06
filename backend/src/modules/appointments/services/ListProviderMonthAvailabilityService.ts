import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const eachDayInMonth = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );
    const availability = eachDayInMonth.map(day => {
      const appointmentInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        available: appointmentInDay.length < 10,
      };
    });
    return availability;
  }
}
export default ListProviderMonthAvailabilityService;
