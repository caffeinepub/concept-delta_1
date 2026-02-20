import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Trash2, Calendar, Award } from 'lucide-react';
import type { Question } from '../backend';

interface QuestionCardProps {
  question: Question;
  onDelete: (question: Question) => void;
}

export default function QuestionCard({ question, onDelete }: QuestionCardProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const imageUrl = question.questionImage?.getDirectURL();

  return (
    <Card className="flex h-full flex-col overflow-hidden border-2 border-brand-navy/20 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="space-y-3 bg-gradient-to-br from-brand-blue/10 to-brand-navy/5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-brand-navy text-white hover:bg-brand-navy/90">
              {question.classLevel}
            </Badge>
            <Badge className="bg-brand-blue text-white hover:bg-brand-blue/90">
              {question.subject}
            </Badge>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            ID: {question.id.toString()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-brand-navy">Chapter:</p>
          <p className="text-base font-semibold text-brand-navy">{question.chapter}</p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 p-4">
        {/* Question Image */}
        {imageUrl ? (
          <div className="overflow-hidden rounded-lg border-2 border-brand-blue/30 bg-white">
            <img
              src={imageUrl}
              alt={`Question ${question.id}`}
              className="h-[150px] w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-[150px] items-center justify-center rounded-lg border-2 border-dashed border-brand-navy/20 bg-gray-50">
            <p className="text-sm text-muted-foreground">No image</p>
          </div>
        )}

        {/* Question Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Correct Answer:</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
              {question.correctAnswer}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Award className="h-4 w-4" />
              Marks:
            </span>
            <span className="text-sm font-semibold text-brand-navy">
              {question.marks.toString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-gray-50 p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {formatDate(question.createdAt)}
        </div>
        <Button
          onClick={() => onDelete(question)}
          variant="destructive"
          size="sm"
          className="gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
