import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { BsFillStopCircleFill } from "react-icons/bs";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { LuRefreshCcw } from "react-icons/lu";
import { RiSendPlane2Fill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

export const RRInput = (props: {
  isFirstChat: boolean;
  inChat: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
  onSearch: () => void;
  isSearching: boolean;
  placeholder?: string;
  className?: string;
}) => {
  const [input, setInput] = React.useState<string>("");
  const [confirming, setConfirming] = React.useState<boolean>(false);
  const { _ } = useLingui();

  useEffect(() => {
    if (!props.inChat) setInput("");
  }, [props.inChat]);

  function handleButtonClicked() {
    if (props.inChat) {
      setConfirming(true);
    } else {
      props.onSearch();
    }
  }

  function handleSendClicked() {
    props.onSend(input);
    setInput("");
  }

  const showSendButton = input.length > 0 && props.inChat;

  return (
    <div
      className={twMerge(
        "flex flex-row items-center w-full gap-2 sm:w-[400px] md:w-[500px] lg:w-[700px] " +
          "fixed bottom-0 left-0 right-0 p-2 z-30 bg-gradient-to-t via-black/95 from-black",
        props.className,
      )}
    >
      <ConfirmCloseModal
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        onConfirmed={props.onStop}
      />
      <Textarea
        rows={1}
        maxRows={3}
        value={input}
        onValueChange={setInput}
        disabled={!props.inChat}
        placeholder={props.placeholder ?? _(msg`Your message...`)}
        variant={"bordered"}
        className={"flex-1"}
        id={"rr-main-textarea"} // Otherwise it logs an error.
        aria-describedby={"rr-main-textarea-desc"} // Otherwise it logs an annoying error to the console.
        type={"text"}
      />

      <div className={"absolute right-4"}>
        {showSendButton && (
          <SendButton inChat={props.inChat} handleSendClicked={handleSendClicked} />
        )}

        {!showSendButton && (
          <ActionButton
            firstChat={props.isFirstChat}
            isSearching={props.isSearching}
            inChat={props.inChat}
            handleButtonClicked={handleButtonClicked}
          />
        )}
      </div>
    </div>
  );
};

function ConfirmCloseModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h4>
                <Trans>Are you sure you want to end the chat?</Trans>
              </h4>
            </ModalHeader>
            <ModalFooter>
              <Button variant={"light"} color={"primary"} onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Button
                color={"danger"}
                onClick={() => {
                  onClose();
                  props.onConfirmed();
                }}
              >
                <Trans>End Chat</Trans>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function ActionButton(props: {
  isSearching: boolean;
  firstChat: boolean;
  inChat: boolean;
  handleButtonClicked: () => void;
}) {
  return (
    <Button
      disabled={props.isSearching}
      isIconOnly
      className={"p-1 bg-transparent"}
      onClick={props.handleButtonClicked}
    >
      {props.inChat && <BsFillStopCircleFill size={30} className={"text-danger"} />}
      {!props.inChat && (!props.firstChat || props.isSearching) && (
        <LuRefreshCcw
          size={30}
          className={twMerge(
            props.isSearching && "animate-spin",
            props.isSearching && "text-foreground-400",
          )}
        />
      )}
      {!props.inChat && props.firstChat && !props.isSearching && (
        <HiOutlineMagnifyingGlass
          size={30}
          className={twMerge(props.isSearching && "text-foreground-400")}
        />
      )}
    </Button>
  );
}

function SendButton(props: { inChat: boolean; handleSendClicked: () => void }) {
  return (
    <Button
      disabled={!props.inChat}
      isIconOnly
      className={"p-1 bg-transparent"}
      onClick={props.handleSendClicked}
    >
      <RiSendPlane2Fill size={30} />
    </Button>
  );
}
