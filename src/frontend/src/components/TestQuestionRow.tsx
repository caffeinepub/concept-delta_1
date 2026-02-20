import { Checkbox } from '@/components/ui/checkbox';
import type { Question } from '../backend';

interface TestQuestionRowProps {
  question: Question;
  isSelected: boolean;
  onToggle: (questionId: string) => void;
}

export default function TestQuestionRow({ question, isSelected, onToggle }: TestQuestionRowProps) {
  const imageUrl = question.questionImage?.getDirectURL();

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border-2 p-3 transition-all md:p-4 ${
        isSelected
          ? 'border-brand-blue bg-brand-blue/10'
          : 'border-brand-navy/20 bg-white hover:border-brand-blue/50'
      }`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(question.id.toString())}
        className="h-5 w-5"
      />

      <div className="flex flex-1 items-center gap-4 overflow-hidden">
        {imageUrl && (
          <div className="shrink-0">
            <img
              src={imageUrl}
              alt={`Question ${question.id}`}
              className="h-16 w-16 rounded-md border border-brand-navy/20 object-cover md:h-20 md:w-20"
            />
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-brand-navy">ID: {question.id.toString()}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm font-medium text-brand-blue">{question.chapter}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Answer: {question.correctAnswer}</span>
            <span>•</span>
            <span>Marks: {question.marks.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
