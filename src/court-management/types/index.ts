export type TimeSlot = {
    id: number;
    createdAt: string;
    updatedAt: string;
    day: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
    timeSlot: {
        id: number;
        startTime: string;
        endTime: string;
        createdAt: string;
        updatedAt: string;
    };
};

export type CourtScheduleElem = {
    timeslots: CourtSchedule[] | TimeSlot[];
    dateList: string[];
};

export type CourtSchedule = {
    [day: string]: CourtScheduleElem;
};

export type Court = {
    id: number;
    name: string;
    location: string;
    courtLength: number;
    courtWidth: number;
    courtSchedules: CourtSchedule;
};

export type TimeSlotWithCourts = {
    courtSchedule: CourtSchedule;
    date: string;
    startTime: string;
    endTime: string;
    courts: number[];
};