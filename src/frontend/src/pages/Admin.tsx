import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';
import { useCreateQuestion } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { compressImage } from '../utils/imageCompression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, X, CheckCircle2, ImageIcon, LayoutGrid, FileText } from 'lucide-react';

interface ImagePreview {
  url: string;
  file: File;
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const createQuestion = useCreateQuestion();

  // Form state - classification fields
  const [classLevel, setClassLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [questionImage, setQuestionImage] = useState<ImagePreview | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [marks, setMarks] = useState(1);

  // UI state
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      setValidationError('Please upload only JPG or PNG images');
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setQuestionImage({ url, file });
  };

  const removeImage = () => {
    if (questionImage) {
      URL.revokeObjectURL(questionImage.url);
    }
    setQuestionImage(null);
  };

  const validateForm = (): boolean => {
    setValidationError('');

    // Validate classLevel
    if (!classLevel.trim()) {
      setValidationError('Class Level is required');
      return false;
    }

    // Validate subject
    if (!subject.trim()) {
      setValidationError('Subject is required');
      return false;
    }

    // Validate chapter
    if (!chapter.trim()) {
      setValidationError('Chapter is required');
      return false;
    }

    // Require question image
    if (!questionImage) {
      setValidationError('Question image is required');
      return false;
    }

    // Validate correct answer is selected
    if (!correctAnswer) {
      setValidationError('Please select the correct answer');
      return false;
    }

    // Validate marks
    if (marks < 1) {
      setValidationError('Marks must be at least 1');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setClassLevel('');
    setSubject('');
    setChapter('');
    removeImage();
    setCorrectAnswer('');
    setMarks(1);
    setValidationError('');
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Compress and convert image to ExternalBlob
      const compressed = await compressImage(questionImage!.file);
      const blob = ExternalBlob.fromBytes(compressed).withUploadProgress(
        (percentage) => {
          setUploadProgress(percentage);
        }
      );

      await createQuestion.mutateAsync({
        classLevel: classLevel.trim(),
        subject: subject.trim(),
        chapter: chapter.trim(),
        questionImage: blob,
        correctAnswer,
        marks: BigInt(marks),
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Failed to create question:', error);
      setValidationError('Failed to create question. Please try again.');
    }
  };

  const renderProminentImageUpload = () => {
    const isUploading = uploadProgress > 0 && uploadProgress < 100;

    return (
      <div className="space-y-3">
        {questionImage ? (
          <div className="relative mx-auto max-w-2xl">
            <img
              src={questionImage.url}
              alt="Question preview"
              className="w-full rounded-xl border-4 border-brand-blue/30 object-contain shadow-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-3 top-3 rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg hover:bg-destructive/90"
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </button>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                <div className="text-center text-white">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  <p className="mt-2 text-lg font-medium">{uploadProgress}%</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <label className="mx-auto flex max-w-2xl cursor-pointer flex-col items-center justify-center rounded-xl border-4 border-dashed border-brand-blue/40 bg-gradient-to-br from-brand-blue/10 to-brand-navy/5 py-16 transition-all hover:border-brand-blue/60 hover:bg-gradient-to-br hover:from-brand-blue/15 hover:to-brand-navy/10 md:py-20">
            <ImageIcon className="h-16 w-16 text-brand-blue md:h-20 md:w-20" />
            <span className="mt-4 text-center text-lg font-semibold text-brand-navy md:text-xl">
              Click to upload question image *
            </span>
            <span className="mt-2 text-center text-sm text-muted-foreground md:text-base">
              JPG or PNG format (includes question and all 4 options)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              className="hidden"
              disabled={createQuestion.isPending}
            />
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-brand-navy md:text-3xl">Admin Panel</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => navigate({ to: '/admin/gallery' })}
            variant="outline"
            className="border-brand-blue text-brand-navy hover:bg-brand-blue/10"
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Question Gallery
          </Button>
          <Button
            onClick={() => navigate({ to: '/admin/create-test' })}
            variant="outline"
            className="border-brand-blue text-brand-navy hover:bg-brand-blue/10"
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Test
          </Button>
        </div>
      </div>

      {showSuccess && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Question created successfully!
          </AlertDescription>
        </Alert>
      )}

      {validationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Classification Fields */}
        <div className="rounded-lg border-2 border-brand-navy/20 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-brand-navy md:text-xl">
            Question Classification *
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="classLevel" className="text-sm font-medium">
                Class Level *
              </Label>
              <Input
                id="classLevel"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                placeholder="e.g., 11th, 12th"
                className="w-full"
                disabled={createQuestion.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Physics, Chemistry"
                className="w-full"
                disabled={createQuestion.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter" className="text-sm font-medium">
                Chapter *
              </Label>
              <Input
                id="chapter"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g., Mechanics, Optics"
                className="w-full"
                disabled={createQuestion.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks" className="text-sm font-medium">
                Marks *
              </Label>
              <Input
                id="marks"
                type="number"
                min="1"
                step="1"
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                placeholder="e.g., 1, 2, 3"
                className="w-full"
                disabled={createQuestion.isPending}
                required
              />
            </div>
          </div>
        </div>

        {/* Question Image Upload */}
        <div className="rounded-xl border-4 border-brand-blue/40 bg-gradient-to-br from-brand-blue/10 via-white to-brand-navy/5 p-6 shadow-lg md:p-8">
          <div className="mb-4 flex items-start gap-3">
            <ImageIcon className="mt-1 h-6 w-6 shrink-0 text-brand-blue md:h-7 md:w-7" />
            <div>
              <h2 className="text-xl font-bold text-brand-navy md:text-2xl">
                Upload Full Question Block Image *
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Upload a single cropped image that contains the question and all 4 options.
              </p>
            </div>
          </div>
          {renderProminentImageUpload()}
        </div>

        {/* Correct Answer Section */}
        <div className="rounded-lg border-2 border-brand-navy/20 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-3 text-lg font-semibold text-brand-navy md:mb-4 md:text-xl">
            Correct Answer *
          </h2>
          <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the correct answer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Option A</SelectItem>
              <SelectItem value="B">Option B</SelectItem>
              <SelectItem value="C">Option C</SelectItem>
              <SelectItem value="D">Option D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createQuestion.isPending}
            className="w-full bg-gradient-to-r from-brand-navy to-brand-blue px-8 py-3 text-white hover:opacity-90 md:w-auto md:py-2"
          >
            {createQuestion.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Question...
              </>
            ) : (
              'Create Question'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
