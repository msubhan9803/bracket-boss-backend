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

export type CourtSchedule = {
    [day: string]: {
        timeslots: TimeSlot[];
        dateList: string[];
    };
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
    date: string;
    startTime: string;
    endTime: string;
    courts: number[];
};