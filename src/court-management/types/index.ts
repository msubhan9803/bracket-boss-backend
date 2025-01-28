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
    timeslots: CourtScheduleType[] | TimeSlot[];
    dateList: string[];
};

export type CourtScheduleType = {
    [day: string]: CourtScheduleElem;
};

export type Court = {
    id: number;
    name: string;
    location: string;
    courtLength: number;
    courtWidth: number;
    courtSchedules: CourtScheduleType;
};

export type TimeSlotWithCourts = {
    courtSchedules: number[];
    date: string;
    startTime: string;
    endTime: string;
};