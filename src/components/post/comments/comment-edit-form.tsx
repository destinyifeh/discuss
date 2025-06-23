import {Button} from '@/components/ui/button';
import {Check, X} from 'lucide-react';

interface CommentEditFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const CommentEditForm = ({onSave, onCancel}: CommentEditFormProps) => {
  return (
    <div className="flex gap-2 mt-3">
      <Button size="sm" onClick={onSave} className="bg-app hover:bg-app/90">
        <Check size={16} className="mr-1" />
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={onCancel}>
        <X size={16} className="mr-1" />
        Cancel
      </Button>
    </div>
  );
};

export default CommentEditForm;
