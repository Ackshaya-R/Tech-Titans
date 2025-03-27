
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AIIntegrationProps {
  onSetAPIKey: (key: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AIIntegration = ({ onSetAPIKey, isOpen, onClose }: AIIntegrationProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      onSetAPIKey(apiKey);
      setIsLoading(false);
      toast({
        title: "Success",
        description: "AI integration enabled successfully!",
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enable AI Integration</DialogTitle>
          <DialogDescription>
            Enter your API key to enable advanced AI responses in the chatbot.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="apiKey"
              placeholder="Enter your AI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is only stored locally and never sent to our servers.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIIntegration;
