"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Trash as TrashIcon } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useOrigin } from "@/hooks/useOrigin";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
  initialData: Billboard | null;
}
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});
type BillboardFormValue = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const origin = useOrigin();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<BillboardFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { label: "", imageUrl: "" },
  });
  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new Billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";
  const action = initialData ? "Save changes" : "Create billboard";
  const onSubmit = async (data: BillboardFormValue) => {
    try {
      setLoading(true
      
      
      );
      if (initialData) {
        await axios.patch(
          `/api/stores/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMessage);
    } catch (error) {
      console.trace("error", error);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push("/");
      toast.success("Billboard deleted");
    } catch (error) {
      toast.error(
        "Make sure you removed all categories first using this billboard"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard Label"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
