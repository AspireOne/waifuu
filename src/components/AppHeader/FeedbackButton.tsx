import { api } from "@lib/api";
import { Trans, t } from "@lingui/macro";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Tooltip } from "@nextui-org/tooltip";
import { useSession } from "@providers/SessionProvider";
import { useState } from "react";
import { MdOutlineFeedback } from "react-icons/md";
import { toast } from "react-toastify";

export const FeedbackButton = () => {
  const { refetch, user } = useSession();
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [feedback, setFeedback] = useState<string>();
  const feedbackMut = api.general.submitFeedback.useMutation({
    onSuccess() {
      toast(t`Feedback sent. Thank you!`, { type: "success", delay: 1500 });
      onClose();
      setFeedback("");
    },
  });

  const isSendable = feedback?.length && feedback.length > 6;

  function handleSubmit() {
    if (!isSendable) return;
    feedbackMut.mutate({ feedback });
  }

  return (
    <>
      <Tooltip content={t`Feedback`} closeDelay={0}>
        <Button
          isIconOnly
          // @ts-ignore
          variant={null}
          className={"p-0 m-0 text-gray-400"}
          onClick={() => (isOpen ? onClose() : onOpen())}
        >
          <MdOutlineFeedback className={"p-0 m-0"} size={28} />
        </Button>
      </Tooltip>

      <Modal
        className={"z-[300]"}
        scrollBehavior={"inside"}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        size={"lg"}
        backdrop={"blur"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <Trans>
                  Have any issues? Suggestions? Or just want to say hi? Give us feedback
                </Trans>
              </ModalHeader>
              <ModalBody>
                <Textarea
                  label={t`Feedback`}
                  isRequired={true}
                  placeholder={t`I love this app!`}
                  value={feedback}
                  variant={"bordered"}
                  onValueChange={setFeedback}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isDisabled={!isSendable}
                  //isLoading={selfUpdate.isLoading} // TODO
                  color="secondary"
                  onClick={handleSubmit}
                >
                  <Trans>Send</Trans>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
