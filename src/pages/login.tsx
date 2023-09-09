import { Button, Card, Image } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";

const Login = () => {
  return (
    <div>
      <Image
        alt="background"
        loading="eager"
        src={"/assets/background.png"}
        className="fixed left-0 top-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="fixed left-0 top-0 z-20 h-full w-full bg-black bg-opacity-75" />

      <div className="fixed left-[50%] top-5 z-30 max-w-[500px] translate-x-[-50%] p-7">
        <h1 className="text-5xl font-extrabold text-white">
          The companion that is always by your side.
        </h1>

        <Image
          alt="background"
          loading="eager"
          src={"/assets/character.png"}
          className="mt-[-50px] h-[400px] w-[350px] object-cover"
          width={1920}
          height={1080}
        />

        <Card className="flex-column flex gap-3 p-2">
          <Button size="lg" startContent={<FcGoogle />}>
            Login with Google
          </Button>
          <Button size="lg" startContent={<AiFillFacebook />}>
            Login with Facebook
          </Button>
          <Button size="lg" startContent={<BsTwitter />}>
            Login with Twitter
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Login;
