import IAppointment from '../entities/IAppointment';

import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

interface IAppointmentsRepository {
  findByDate(date: Date): Promise<IAppointment | undefined>;
  create(data: ICreateAppointmentDTO): Promise<IAppointment>;
}

export default IAppointmentsRepository;
