const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const USER_API_END_POINT = `${BASE_URL}/api/v1/auth`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const MESSAGE_API_END_POINT = `${BASE_URL}/api/v1/message`;