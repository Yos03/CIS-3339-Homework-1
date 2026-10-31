export class ApiError extends Error {
  constructor(message, status = 0, fields = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

// Small fetch wrapper: JSON in/out, and every failure becomes an ApiError with a readable message.
async function request(path, { method = 'GET', body, params } = {}) {
  let url = `/api${path}`;
  if (params) {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
    if ([...qs].length) url += `?${qs}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check that the application is running.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* non-JSON response */
  }

  if (!response.ok) {
    throw new ApiError(data?.error || `Request failed (HTTP ${response.status})`, response.status, data?.fields || {});
  }
  return data;
}

const enc = encodeURIComponent;

export const api = {
  listStudents: (search) => request('/students', { params: { search } }),
  addStudent: (student) => request('/students', { method: 'POST', body: student }),
  deleteStudent: (studentId) => request(`/students/${enc(studentId)}`, { method: 'DELETE' }),

  listCourses: () => request('/courses'),
  addCourse: (course) => request('/courses', { method: 'POST', body: course }),
  deleteCourse: (courseId) => request(`/courses/${enc(courseId)}`, { method: 'DELETE' }),
  getRoster: (courseId) => request(`/courses/${enc(courseId)}/students`),

  enroll: (studentId, courseId) => request('/enrollments', { method: 'POST', body: { studentId, courseId } }),
  removeEnrollment: (id) => request(`/enrollments/${enc(id)}`, { method: 'DELETE' }),
};
