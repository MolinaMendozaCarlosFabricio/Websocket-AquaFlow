import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { SensorReadings } from '../../../domain/SensorReadings/SensorReadings';
import { Measurements } from '../../../domain/SensorReadings/Measurements';
import { SocketRepository } from '../../../domain/Socket_repository';
import { WaterActivitiesList } from '../../../domain/WaterActivities/WaterActivitiesList';

export class SocketAdapter implements SocketRepository {
  constructor(private io: Server){}

  public emitSensorReadings(user_id: string, payload: Measurements) {
    console.log("Emitiendo lecturas de datos al usuario ", user_id, ":", payload);
    this.io.to(user_id).emit("send_sensor_readings", payload)
  }

  public emitNotification(user_id: string, payload: Notification) {
    console.log("Emitiendo una lectura de sensor al usuario ", user_id, ":", payload);
    this.io.to(user_id).emit("send_notification", payload);
  }

  public emitWaterActivities(user_id: string, payload: WaterActivitiesList) {
    console.log("Emitiendo actividades con agua al usuario ", user_id, ":", payload);
    this.io.to(user_id).emit("send_water_activities", payload);
  }

}