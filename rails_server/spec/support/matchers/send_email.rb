require 'rspec/expectations'

RSpec::Matchers.define :send_email do |mailer_action|
  match do |mailer_class|
    message_delivery = instance_double(ActionMailer::MessageDelivery)

    if @expected_mailer_args == nil
      expect(mailer_class)
        .to receive(mailer_action)
        .and_return(message_delivery)
    else
      expect(mailer_class)
        .to receive(mailer_action)
        .with(*@expected_mailer_args)
        .and_return(message_delivery)
    end

    allow(message_delivery).to receive(:deliver_later)
  end

  chain :with do |*args|
    @expected_mailer_args = args
  end
end
