import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useGetAllQuestions, useCreateTest, useUpdateTestStatus } from '../hooks/useQueries';
import TestQuestionRow from '../components/TestQuestionRow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import type { Question } from '../backend';

export default function CreateTest() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { data: questions, isLoading: questionsLoading } = useGetAllQuestions();
  const createTest = useCreateTest();
  const updateTestStatus = useUpdateTestStatus();

  // Form state
  const [testName, setTestName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [marksPerQuestion, setMarksPerQuestion] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  const [createdTestId, setCreatedTestId] = useState<string | null>(null);

  // UI state
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter questions based on selected class and subject
  const filteredQuestions = useMemo(() => {
    if (!questions || !classLevel || !subject) return [];

    return questions.filter(
      (question) => question.classLevel === classLevel && question.subject === subject
    );
  }, [questions, classLevel, subject]);

  useEffect(() => {
    // Redirect unauthenticated users to home
    if (!isAuthenticated) {
      navigate({ to: '/' });
      return;
    }

    // Redirect non-admin users to dashboard
    if (role !== 'admin') {
      navigate({ to: '/dashboard' });
      return;
    }
  }, [isAuthenticated, role, navigate]);

  // Don't render content if not authenticated or not admin
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  const handleQuestionToggle = (questionId: string) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const validateForm = (): boolean => {
    setValidationError('');

    if (!testName.trim()) {
      setValidationError('Test Name is required');
      return false;
    }

    if (!classLevel) {
      setValidationError('Class Level is required');
      return false;
    }

    if (!subject) {
      setValidationError('Subject is required');
      return false;
    }

    if (!duration || parseInt(duration) <= 0) {
      setValidationError('Duration must be a positive number');
      return false;
    }

    if (!marksPerQuestion || (marksPerQuestion !== '1' && marksPerQuestion !== '2')) {
      setValidationError('Marks Per Question must be 1 or 2');
      return false;
    }

    if (selectedQuestionIds.size === 0) {
      setValidationError('Please select at least one question');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setTestName('');
    setClassLevel('');
    setSubject('');
    setDuration('');
    setMarksPerQuestion('');
    setSelectedQuestionIds(new Set());
    setValidationError('');
    setCreatedTestId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const testId = await createTest.mutateAsync({
        testName: testName.trim(),
        classLevel,
        subject,
        duration: BigInt(parseInt(duration)),
        marksPerQuestion: BigInt(parseInt(marksPerQuestion)),
        questionIds: Array.from(selectedQuestionIds),
      });

      setCreatedTestId(testId);
      setSuccessMessage('Test created successfully as draft!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Failed to create test:', error);
      setValidationError('Failed to create test. Please try again.');
    }
  };

  const handlePublish = async () => {
    if (!createdTestId) return;

    try {
      await updateTestStatus.mutateAsync({
        testId: createdTestId,
        status: 'published',
      });

      setSuccessMessage('Test published successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      setCreatedTestId(null);
    } catch (error) {
      console.error('Failed to publish test:', error);
      setValidationError('Failed to publish test. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Button
          onClick={() => navigate({ to: '/admin' })}
          variant="ghost"
          className="mb-2 -ml-2 text-brand-navy hover:bg-brand-blue/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin
        </Button>
        <h1 className="text-2xl font-bold text-brand-navy md:text-3xl">Create Test</h1>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Test Details */}
        <div className="rounded-lg border-2 border-brand-navy/20 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-blue" />
            <h2 className="text-lg font-semibold text-brand-navy md:text-xl">Test Details</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="testName" className="text-sm font-medium">
                Test Name *
              </Label>
              <Input
                id="testName"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g., Physics Chapter 1 Test"
                className="w-full"
                disabled={createTest.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classLevel" className="text-sm font-medium">
                Class Level *
              </Label>
              <Select value={classLevel} onValueChange={setClassLevel} disabled={createTest.isPending}>
                <SelectTrigger id="classLevel" className="w-full">
                  <SelectValue placeholder="Select class level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11th">11th</SelectItem>
                  <SelectItem value="12th">12th</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </Label>
              <Select value={subject} onValueChange={setSubject} disabled={createTest.isPending}>
                <SelectTrigger id="subject" className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Maths">Maths</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes) *
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 60"
                className="w-full"
                disabled={createTest.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marksPerQuestion" className="text-sm font-medium">
                Marks Per Question *
              </Label>
              <Select
                value={marksPerQuestion}
                onValueChange={setMarksPerQuestion}
                disabled={createTest.isPending}
              >
                <SelectTrigger id="marksPerQuestion" className="w-full">
                  <SelectValue placeholder="Select marks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Question Selection */}
        {classLevel && subject && (
          <div className="rounded-lg border-2 border-brand-navy/20 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-navy md:text-xl">Select Questions</h2>
              <div className="rounded-lg bg-brand-navy px-4 py-2 text-center">
                <p className="text-sm font-medium text-white">
                  Selected: {selectedQuestionIds.size}
                </p>
              </div>
            </div>

            {questionsLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-blue" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading questions...</p>
                </div>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-brand-navy/20 bg-gradient-to-br from-brand-blue/5 to-brand-navy/5">
                <p className="text-center text-muted-foreground">
                  No questions available for {classLevel} {subject}.
                  <br />
                  Please create questions first.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] space-y-3 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <TestQuestionRow
                    key={question.id.toString()}
                    question={question}
                    isSelected={selectedQuestionIds.has(question.id.toString())}
                    onToggle={handleQuestionToggle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-end">
          {createdTestId && (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={updateTestStatus.isPending}
              className="w-full bg-green-600 px-8 py-3 text-white hover:bg-green-700 md:w-auto md:py-2"
            >
              {updateTestStatus.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Last Test'
              )}
            </Button>
          )}
          <Button
            type="submit"
            disabled={createTest.isPending}
            className="w-full bg-gradient-to-r from-brand-navy to-brand-blue px-8 py-3 text-white hover:opacity-90 md:w-auto md:py-2"
          >
            {createTest.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Test...
              </>
            ) : (
              'Save Test'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
