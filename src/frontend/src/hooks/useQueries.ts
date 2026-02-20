import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';
import type { Question } from '../backend';

interface CreateQuestionParams {
  classLevel: string;
  subject: string;
  chapter: string;
  questionImage: ExternalBlob | null;
  correctAnswer: string;
  marks: bigint;
}

export function useCreateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateQuestionParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.createQuestion(
        params.classLevel,
        params.subject,
        params.chapter,
        params.questionImage,
        params.correctAnswer,
        params.marks
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useGetAllQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

interface CreateTestParams {
  testName: string;
  classLevel: string;
  subject: string;
  duration: bigint;
  marksPerQuestion: bigint;
  questionIds: string[];
}

export function useCreateTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateTestParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.createTest(
        params.testName,
        params.classLevel,
        params.subject,
        params.duration,
        params.marksPerQuestion,
        params.questionIds
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

interface UpdateTestStatusParams {
  testId: string;
  status: string;
}

export function useUpdateTestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateTestStatusParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.updateTestStatus(params.testId, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}
