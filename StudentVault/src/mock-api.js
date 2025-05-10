import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

// Mock student data
const students = [
  { id: 1, name: 'John Doe', email: 'john@example.com', course: 'React' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Angular' },
  { id: 3, name: 'Bill Gates', email: 'bill@example.com', course: 'React' },
];

mock.onGet('/students').reply(200, students);
mock.onPost('/add-student').reply((config) => {
  const newStudent = JSON.parse(config.data);
  students.push(newStudent);
  return [200, newStudent];
});
