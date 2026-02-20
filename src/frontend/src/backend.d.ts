import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Question {
    id: bigint;
    marks: bigint;
    subject: string;
    createdAt: Time;
    correctAnswer: string;
    questionImage?: ExternalBlob;
    classLevel: string;
    chapter: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createQuestion(classLevel: string, subject: string, chapter: string, questionImage: ExternalBlob | null, correctAnswer: string, marks: bigint): Promise<void>;
    createTest(testName: string, classLevel: string, subject: string, duration: bigint, marksPerQuestion: bigint, questionIds: Array<string>): Promise<string>;
    deleteQuestion(id: bigint): Promise<boolean>;
    getAllQuestions(): Promise<Array<Question>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getQuestion(id: bigint): Promise<Question | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateTestStatus(testId: string, status: string): Promise<void>;
}
