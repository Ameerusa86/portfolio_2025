"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AboutData, CreateAboutData, UpdateAboutData } from "@/types/about";
import { Save, Plus, X, Eye, User, FileText, Code, Target } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImagePicker from "@/components/ImagePicker";
import { ImageUploadService } from "@/lib/image-upload";

interface AboutFormProps {
  aboutData?: AboutData | null;
  onSave: (data: CreateAboutData | UpdateAboutData) => Promise<void>;
  isLoading?: boolean;
}

export default function AboutForm({
  aboutData,
  onSave,
  isLoading = false,
}: AboutFormProps) {
  const [formData, setFormData] = useState<CreateAboutData>({
    title: "",
    subtitle: "",
    hero_description: "",
    story_title: "",
    story_content: [""],
    skills_title: "",
    skills: [""],
    cta_title: "",
    cta_description: "",
    profile_image: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newStoryParagraph, setNewStoryParagraph] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (aboutData) {
      setFormData({
        title: aboutData.title || "",
        subtitle: aboutData.subtitle || "",
        hero_description: aboutData.hero_description || "",
        story_title: aboutData.story_title || "",
        story_content: aboutData.story_content || [""],
        skills_title: aboutData.skills_title || "",
        skills: aboutData.skills || [""],
        cta_title: aboutData.cta_title || "",
        cta_description: aboutData.cta_description || "",
        profile_image: aboutData.profile_image || "",
      });
    }
  }, [aboutData]);

  const handleInputChange = (field: keyof CreateAboutData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "skills" | "story_content",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "skills" | "story_content", value: string) => {
    if (!value.trim()) return;

    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));

    if (field === "skills") {
      setNewSkill("");
    } else {
      setNewStoryParagraph("");
    }
  };

  const removeArrayItem = (
    field: "skills" | "story_content",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setImageUploading(true);
      const imageUrl = await ImageUploadService.uploadProfileImage(file);
      setFormData((prev) => ({
        ...prev,
        profile_image: imageUrl,
      }));
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        skills: formData.skills.filter((skill) => skill.trim() !== ""),
        story_content: formData.story_content.filter(
          (paragraph) => paragraph.trim() !== ""
        ),
      };

      if (aboutData?.id) {
        await onSave({ ...cleanedData, id: aboutData.id });
      } else {
        await onSave(cleanedData);
      }

      toast.success("About page updated successfully!");
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Failed to save about page. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">About Page Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your about page content and settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/about" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Hero Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="About Me"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="space-y-3">
                  <ImagePicker
                    onChange={handleImageUpload}
                    previewUrl={formData.profile_image}
                  />
                  {imageUploading && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Uploading image...
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Upload a profile image or leave empty for default avatar
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                placeholder="Full-stack developer passionate about..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_description">Hero Description</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) =>
                  handleInputChange("hero_description", e.target.value)
                }
                placeholder="Detailed description for the hero section..."
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Story Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="story_title">Story Title</Label>
              <Input
                id="story_title"
                value={formData.story_title}
                onChange={(e) =>
                  handleInputChange("story_title", e.target.value)
                }
                placeholder="My Story"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Story Paragraphs</Label>
              {formData.story_content.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) =>
                      handleArrayChange("story_content", index, e.target.value)
                    }
                    placeholder={`Paragraph ${index + 1}...`}
                    rows={3}
                    className="flex-1"
                  />
                  {formData.story_content.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("story_content", index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex gap-2">
                <Textarea
                  value={newStoryParagraph}
                  onChange={(e) => setNewStoryParagraph(e.target.value)}
                  placeholder="Add new paragraph..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addArrayItem("story_content", newStoryParagraph)
                  }
                  disabled={!newStoryParagraph.trim()}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Skills Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="skills_title">Skills Title</Label>
              <Input
                id="skills_title"
                value={formData.skills_title}
                onChange={(e) =>
                  handleInputChange("skills_title", e.target.value)
                }
                placeholder="Skills & Technologies"
                required
              />
            </div>

            <div className="space-y-4">
              <Label>Skills List</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills
                  .filter((skill) => skill.trim())
                  .map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("skills", index)}
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new skill..."
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addArrayItem("skills", newSkill);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem("skills", newSkill)}
                  disabled={!newSkill.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Call to Action Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cta_title">CTA Title</Label>
              <Input
                id="cta_title"
                value={formData.cta_title}
                onChange={(e) => handleInputChange("cta_title", e.target.value)}
                placeholder="Let's Work Together"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta_description">CTA Description</Label>
              <Textarea
                id="cta_description"
                value={formData.cta_description}
                onChange={(e) =>
                  handleInputChange("cta_description", e.target.value)
                }
                placeholder="I'm always interested in new opportunities..."
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
