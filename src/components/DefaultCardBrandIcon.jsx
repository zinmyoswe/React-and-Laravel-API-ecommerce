import React from 'react'

const DefaultCardBrandIcon = () => {
  return (
    <div className="flex items-center absolute right-2 top-2 gap-1 sm:gap-1 md:gap-1 lg:gap-2">
      <img
        src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
        alt="Visa"
        className="h-4 w-auto sm:h-4 md:h-5 lg:h-6"
      />
      <img
        src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
        alt="Mastercard"
        className="h-4 w-auto sm:h-4 md:h-5 lg:h-6"
      />
      <img
        src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg"
        alt="Amex"
        className="h-4 w-auto sm:h-4 md:h-5 lg:h-6"
      />
      <img
        src="https://js.stripe.com/v3/fingerprinted/img/jcb-271fd06e6e7a2c52692ffa91a95fb64f.svg"
        alt="JCB"
        className="h-4 w-auto sm:h-4 md:h-5 lg:h-6"
      />
    </div>
  );
}

export default DefaultCardBrandIcon
