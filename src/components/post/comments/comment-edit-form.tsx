import {Button} from '@/components/ui/button';
import {Check, ImagePlus, X} from 'lucide-react';
import {useRef} from 'react';

interface CommentEditFormProps {
  onSave: () => void;
  onCancel: () => void;
  imagePreview?: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const CommentEditForm = ({
  onSave,
  onCancel,
  imagePreview,
  onImageUpload,
  onImageRemove,
}: CommentEditFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="mt-3">
      {imagePreview && (
        <div className="relative mb-3 rounded-md overflow-hidden border border-gray-200">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-30 object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onImageRemove}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-800/70 hover:bg-gray-900/90">
            <X size={16} />
          </Button>
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          ref={fileInputRef}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="text-app hover:text-app">
          <ImagePlus size={16} className="mr-1" />
          {imagePreview ? 'Change' : 'Add'} Image
        </Button>

        <Button size="sm" onClick={onSave} className="bg-app hover:bg-app/90">
          <Check size={16} className="mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X size={16} className="mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CommentEditForm;
