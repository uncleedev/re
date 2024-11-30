import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center">
      <Link href={"/admin/signin"}>Admin</Link>
      <Link href={"/student/signin"}>Student</Link>
      <Link href={"/instructor/signin"}>Instructor</Link>
    </div>
  );
}
