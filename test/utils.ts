import path from 'path';
import { faker } from '@faker-js/faker';
import { postApplication } from './application/endpoint';
import { signin, signup } from './auth/endpoint';
import { Agent } from './endpoint';
import { uploadFile } from './file/endpoint';
import { postPosition } from './position/endpoint';
import { postProject } from './project/endpoint';
import { server } from './server';

export interface FakeUser {
  id: number;
  name: string;
  password: string;
  email: string;
}

export async function setupTestUser(agent: Agent = server): Promise<FakeUser> {
  const fakeUser = {
    name: faker.name.findName(),
    password: '!Inno8space',
    email: faker.internet.email(),
  };
  const [res] = await signup(fakeUser);
  const { id } = res.body.result as { id: number };
  await signin(
    {
      id,
      password: fakeUser.password,
    },
    agent
  );
  return {
    ...fakeUser,
    id,
  };
}

export interface FakeProject {
  id: number;
  name: string;
  summary: string;
  description: string;
  fields: string[];
  contactName: string;
  contactEmail: string;
  public: boolean;
  website?: string;
  avatar?: string;
}

export async function setupTestProject(
  agent: Agent,
  option: Partial<Omit<FakeProject, 'id'>> = {}
): Promise<FakeProject> {
  const fakeProject = {
    name: faker.datatype.string(),
    summary: faker.datatype.string(),
    description: faker.datatype.string(),
    fields: [faker.datatype.string(), faker.datatype.string()],
    contactName: faker.name.findName(),
    contactEmail: faker.internet.email(),
    public: faker.datatype.boolean(),
    ...option,
  };
  const [res] = await postProject(fakeProject, agent);
  const { id } = res.body.result as { id: number };
  return {
    ...fakeProject,
    id,
  };
}

export interface FakePosition {
  id: number;
  title: string;
  description: string;
  requirement: string;
  preference: string;
  skills: string[];
  project: number;
  public: boolean;
}

export async function setupTestPosition(
  agent: Agent,
  projectId: number,
  option: Partial<Omit<FakePosition, 'id' | 'project'>> = {}
): Promise<FakePosition> {
  const fakePosition = {
    title: faker.datatype.string(),
    description: faker.datatype.string(50),
    requirement: faker.datatype.string(50),
    preference: faker.datatype.string(50),
    skills: [faker.datatype.string(), faker.datatype.string()],
    project: projectId,
    public: faker.datatype.boolean(),
    ...option,
  };
  const [res] = await postPosition(fakePosition, agent);
  const { id } = res.body.result as { id: number };
  return {
    ...fakePosition,
    id,
  };
}

export interface FakeApplication {
  id: number;
  project: number;
  position: number;
  name: string;
  email: string;
  resume: string;
}

export async function setupTestApplication(
  agent: Agent,
  projectId: number,
  positionId: number,
  fileId: string,
  option: Partial<
    Omit<FakeApplication, 'id' | 'project' | 'position' | 'resume'>
  > = {}
): Promise<FakeApplication> {
  const fakeApplication = {
    project: projectId,
    position: positionId,
    name: faker.name.findName(),
    email: faker.internet.email(),
    resume: fileId,
    ...option,
  };
  const [res] = await postApplication(fakeApplication, agent);
  const { id } = res.body.result as { id: number };
  return {
    ...fakeApplication,
    id,
  };
}

export interface FakeFile {
  id: string;
}

export async function setupTestAvatar(agent: Agent): Promise<FakeFile> {
  const [res] = await uploadFile(
    path.resolve(__dirname, 'file/logo.png'),
    agent
  );
  const { id } = res.body.result as { id: string };
  return { id };
}

export async function setupTestResume(agent: Agent): Promise<FakeFile> {
  const [res] = await uploadFile(
    path.resolve(__dirname, 'file/resume.pdf'),
    agent
  );
  const { id } = res.body.result as { id: string };
  return { id };
}
