"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  FileSpreadsheet, Upload, Download, Loader2, CheckCircle2, XCircle, AlertCircle, Info 
} from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { apiClient } from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export default function BulkUploadControl({ storeId }: { storeId?: number }) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Trigger file download for template Excel
  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      let response;
      try {
        response = await apiClient.get("/api/service/bulk-upload/template", {
          responseType: "blob"
        });
      } catch (err: any) {
        response = await apiClient.get("/api/services/bulk-upload/template", {
          responseType: "blob"
        });
      }
      
      const blob = new Blob([response.data], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products-template.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(t("templateDownloaded") || "تم تحميل النموذج بنجاح");
    } catch (error: any) {
      console.error("Failed to download template:", error);
      toast.error(error?.message || "فشل تحميل نموذج Excel");
    } finally {
      setIsDownloading(false);
    }
  };

  // Trigger Excel file upload
  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadResults(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (storeId) {
        formData.append("storeId", String(storeId));
      }

      let response;
      try {
        response = await apiClient.post("/api/service/bulk-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      } catch (err: any) {
        response = await apiClient.post("/api/services/bulk-upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }

      // Handle raw response or nested data structure
      const responseData = response?.data?.data ?? response?.data ?? response;
      
      if (responseData && (responseData.results || responseData.totalRows !== undefined)) {
        setUploadResults(responseData);
        toast.success(t("uploadCompleted") || "تمت معالجة ملف الرفع بنجاح");
        // Invalidate services query to refresh the list in the dashboard table
        queryClient.invalidateQueries({ queryKey: ["services"] });
      } else {
        toast.error(response?.data?.message || "فشل معالجة ملف Excel");
      }
    } catch (error: any) {
      console.error("Failed to upload menu file:", error);
      toast.error(error?.message || "حدث خطأ أثناء رفع ملف Excel");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadResults(null);
    }
  };

  return (
    <>
      <Card className="border border-primary/20 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/50 shadow-sm overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary flex-shrink-0">
                <FileSpreadsheet className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">
                  {t("Bulk Menu Upload (Excel)") || "الرفع الجماعي لقائمة الطعام (Excel)"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {t("bulkUploadDesc") || "يمكنك إضافة وتحديث قائمة الطعام بالكامل دفعة واحدة باستخدام ملف Excel. قم بتحميل النموذج لتنسيق البيانات بشكل صحيح، ثم ارفع الملف."}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadTemplate}
                disabled={isDownloading}
                className="gap-2 border-primary/20 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs w-full sm:w-auto"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Download className="h-4 w-4 text-primary" />
                )}
                {t("Download Template") || "تحميل النموذج الفارغ"}
              </Button>

              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setIsOpen(true)}
                className="gap-2 text-xs w-full sm:w-auto shadow-md"
              >
                <Upload className="h-4 w-4" />
                {t("Upload Menu (Excel)") || "رفع قائمة الطعام"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto z-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Upload className="h-5 w-5 text-primary" />
              {t("Upload Menu via Excel") || "رفع قائمة الطعام عبر Excel"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t("uploadDialogDesc") || "يرجى اختيار ملف Excel يحتوي على قائمة الطعام المعبأة وتأكيد الرفع."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* File Selector Dropzone */}
            <div 
              onClick={() => document.getElementById("excel-file-input")?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-800 hover:border-primary/50 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-all"
            >
              <input 
                id="excel-file-input"
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleFileChange}
              />
              <FileSpreadsheet className="h-12 w-12 mx-auto text-primary/75 mb-3" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {selectedFile ? selectedFile.name : (t("Drag Excel file here or click to select") || "اسحب ملف Excel هنا أو اضغط للاختيار")}
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                {selectedFile 
                  ? `${(selectedFile.size / 1024).toFixed(1)} KB` 
                  : (t("Supports .xlsx and .xls formats only") || "يدعم صيغ .xlsx و .xls فقط")
                }
              </p>
            </div>

            {/* Error Message */}
            {selectedFile && !uploadResults && (
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={handleUploadFile}
                  disabled={isUploading}
                  className="gap-2 text-xs"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {t("Upload File") || "بدء الرفع والمعالجة"}
                </Button>
              </div>
            )}

            {/* Uploading State Spinner */}
            {isUploading && (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("Processing Excel rows, please wait...") || "جاري معالجة صفوف ملف الـ Excel وإضافة المنتجات، يرجى الانتظار..."}
                </p>
              </div>
            )}

            {/* Results Display */}
            {uploadResults && (
              <div className="space-y-4 border-t border-border/60 pt-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  {t("Upload Summary") || "ملخص نتيجة المعالجة"}
                </h3>

                {/* Counts Summary */}
                <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold">
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-border/40 rounded-xl">
                    <p className="text-muted-foreground text-xs">{t("Total Rows") || "إجمالي الصفوف"}</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">{uploadResults.totalRows}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100/50 rounded-xl">
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs">{t("Created Successfully") || "تمت إضافتها"}</p>
                    <p className="text-lg font-bold mt-1">{uploadResults.createdCount}</p>
                  </div>
                  <div className="p-3 bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100/50 rounded-xl">
                    <p className="text-rose-600 dark:text-rose-400 text-xs">{t("Failed Rows") || "فشلت"}</p>
                    <p className="text-lg font-bold mt-1">{uploadResults.failedCount}</p>
                  </div>
                </div>

                {/* Results List Table */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t("Detailed row response:") || "تفصيل مخرجات معالجة كل صف:"}
                  </p>
                  <div className="max-h-64 overflow-y-auto border border-border/80 rounded-xl">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-16 text-center">{t("Row") || "الصف"}</TableHead>
                          <TableHead>{t("Product Name") || "اسم المنتج"}</TableHead>
                          <TableHead className="w-24 text-center">{t("Status") || "الحالة"}</TableHead>
                          <TableHead>{t("Reason / Notes") || "السبب / ملاحظات"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(!uploadResults.results || uploadResults.results.length === 0) ? (
                          <TableRow>
                            <TableCell colSpan={4} className="py-6 text-center text-muted-foreground text-xs">
                              {t("No detailed logs returned") || "لا توجد سجلات تفصيلية متوفرة."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          uploadResults.results.map((res: any, idx: number) => {
                            const isSuccess = res.status === "created";
                            return (
                              <TableRow key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 text-xs">
                                <TableCell className="text-center font-bold text-muted-foreground">
                                  {res.row}
                                </TableCell>
                                <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                                  {res.productName || "—"}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge 
                                    variant={isSuccess ? "success" : "destructive"} 
                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                  >
                                    {isSuccess ? (t("Created") || "ناجح") : (t("Failed") || "فشل")}
                                  </Badge>
                                </TableCell>
                                <TableCell className={isSuccess ? "text-muted-foreground text-xs" : "text-rose-600 dark:text-rose-400 font-semibold text-xs"}>
                                  {isSuccess ? (t("Product added successfully") || "تمت إضافة المنتج بنجاح") : (res.reason || t("Validation error"))}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between items-center border-t border-border/60 pt-4 gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>المنتجات المضافة بنجاح تصبح <strong>نشطة ومفعلة</strong> مباشرة.</span>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                setSelectedFile(null);
                setUploadResults(null);
              }}
              className="text-xs"
            >
              {t("Close") || "إغلاق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
