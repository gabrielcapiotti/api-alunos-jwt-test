-- CreateTable
CREATE TABLE "avaliations" (
    "id" UUID NOT NULL,
    "module" VARCHAR(100) NOT NULL,
    "student_id" UUID NOT NULL,
    "grade" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avaliations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "avaliations" ADD CONSTRAINT "avaliations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
