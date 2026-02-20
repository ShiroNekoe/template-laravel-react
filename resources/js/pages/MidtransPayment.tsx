import { useEffect } from "react";

interface Props {
    snapToken: string;
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function MidtransPayment({ snapToken }: Props) {

    useEffect(() => {
        if (window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: () => {
                    window.location.href = "/payment/success";
                },
                onPending: () => {
                    window.location.href = "/payment/pending";
                },
                onError: () => {
                    alert("Payment gagal");
                }
            });
        }
    }, [snapToken]);

}
