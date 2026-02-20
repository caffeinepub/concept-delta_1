import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useGetAllQuestions, useDeleteQuestion } from '../hooks/useQueries';
import QuestionCard from '../components/QuestionCard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle2, Filter } from 'lucide-react';
import type { Question } from '../backend';

export default function QuestionGallery() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const { data: questions, isLoading, isError } = useGetAllQuestions();
  const deleteQuestion = useDeleteQuestion();

  // Filter state
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [chapterSearch, setChapterSearch] = useState('');

  // Delete modal state
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filter questions based on all three filters - MUST be before any early returns
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];

    return questions.filter((question) => {
      // Class filter
      if (classFilter !== 'All' && question.classLevel !== classFilter) {
        return false;
      }

      // Subject filter
      if (subjectFilter !== 'All' && question.subject !== subjectFilter) {
        return false;
      }

      // Chapter search (case-insensitive)
      if (chapterSearch.trim() && !question.chapter.toLowerCase().includes(chapterSearch.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [questions, classFilter, subjectFilter, chapterSearch]);

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

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    try {
      await deleteQuestion.mutateAsync(questionToDelete.id);
      setQuestionToDelete(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleDeleteCancel = () => {
    setQuestionToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-blue" />
          <p className="mt-4 text-lg text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load questions. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasActiveFilters = classFilter !== 'All' || subjectFilter !== 'All' || chapterSearch.trim() !== '';

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            onClick={() => navigate({ to: '/admin' })}
            variant="ghost"
            className="mb-2 -ml-2 text-brand-navy hover:bg-brand-blue/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-2xl font-bold text-brand-navy md:text-3xl">Question Gallery</h1>
        </div>
        <div className="rounded-lg bg-brand-navy px-6 py-3 text-center">
          <p className="text-sm text-white/80">Total Questions</p>
          <p className="text-3xl font-bold text-white">{filteredQuestions.length}</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Question deleted successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="mb-6 rounded-lg border-2 border-brand-navy/20 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-brand-blue" />
          <h2 className="text-lg font-semibold text-brand-navy">Filters</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="classFilter" className="text-sm font-medium">
              Class Level
            </Label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger id="classFilter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="11th">11th</SelectItem>
                <SelectItem value="12th">12th</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectFilter" className="text-sm font-medium">
              Subject
            </Label>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger id="subjectFilter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Maths">Maths</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapterSearch" className="text-sm font-medium">
              Chapter
            </Label>
            <Input
              id="chapterSearch"
              value={chapterSearch}
              onChange={(e) => setChapterSearch(e.target.value)}
              placeholder="Search by chapter name..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="flex min-h-[40vh] items-center justify-center rounded-lg border-2 border-dashed border-brand-navy/20 bg-gradient-to-br from-brand-blue/5 to-brand-navy/5 p-8">
          <div className="text-center">
            <p className="text-xl font-medium text-muted-foreground">
              {hasActiveFilters ? 'No questions match your filters.' : 'No questions added yet.'}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={() => {
                  setClassFilter('All');
                  setSubjectFilter('All');
                  setChapterSearch('');
                }}
                variant="outline"
                className="mt-4 border-brand-blue text-brand-navy hover:bg-brand-blue/10"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id.toString()}
              question={question}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!questionToDelete}
        questionId={questionToDelete?.id.toString() || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleteQuestion.isPending}
      />
    </div>
  );
}
