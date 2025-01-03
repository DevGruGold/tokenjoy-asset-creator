import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NFTMintingFormProps {
  onMint: (metadata: any) => Promise<void>;
  assetType: string;
  assetFields: string[];
}

const NFTMintingForm: React.FC<NFTMintingFormProps> = ({ onMint, assetType, assetFields }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulateUpload = async () => {
    setUploading(true);
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload an image for your NFT",
        variant: "destructive",
      });
      return;
    }

    try {
      await simulateUpload();
      await onMint({
        ...formData,
        image: preview,
        assetType
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {preview ? (
            <div className="relative aspect-square max-w-md mx-auto">
              <img src={preview} alt="Preview" className="rounded-lg object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview('');
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-gray-400" />
                <span className="text-gray-600">Upload your NFT image</span>
                <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-gray-500 text-center">{uploadProgress}% uploaded</p>
          </div>
        )}

        {assetFields.map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{field}</Label>
            <Input
              id={field}
              placeholder={`Enter ${field.toLowerCase()}`}
              onChange={(e) => handleInputChange(field, e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Create NFT'}
      </Button>
    </form>
  );
};

export default NFTMintingForm;