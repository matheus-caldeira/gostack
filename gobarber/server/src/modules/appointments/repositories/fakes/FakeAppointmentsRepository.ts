import { v4 } from 'uuid';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({
    date,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: v4(),
      date,
      provider_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppoint = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppoint;
  }
}

export default AppointmentsRepository;
