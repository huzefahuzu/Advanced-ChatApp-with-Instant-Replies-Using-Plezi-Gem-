class WebsocketController

    def on_open
        # this is a Hack - replace this with a database token and a cookie.
        return close unless cookies[:_linkedchats_session] # refuse unauthenticated connections
        # this is a Hack - get the user
        @user_id = decrypt_session_cookie(cookies[:_linkedchats_session].dup)['warden.user.user.key'][0][0].to_s
        puts "#{@user_id} is connected"
    end

    def on_message data
        # what do you want to do when you get data?    

        begin

            data = JSON.parse data    

        end

        message = {}
        message[:message] = data["message"]
        message[:event] = :chat
        message[:from] = params[:id]
        message[:at] = Time.now
        broadcast :_send_message, message.to_json
        
    end

    protected

    # this will inform the user that a message is waiting
    def message_waiting msg
        write(msg.to_json) if msg[:to].to_s == @user_id.to_s
    end

    # this is a Hack - replace this later
    # use a token authentication instead (requires a database field)
    def decrypt_session_cookie(cookie)
        key ='4f7fad1696b75330ae19a0eeddb236c123727f2a53a3f98b30bd0fe33cfc26a53e964f849d63ad5086483589d68c566a096d89413d5cb9352b1b4a34e75d7a7b'
        cookie = CGI::unescape(cookie)

        # Default values for Rails 4 apps
        key_iter_num = 1000
        key_size     = 64
        salt         = "encrypted cookie"         
        signed_salt  = "signed encrypted cookie"  

        key_generator = ActiveSupport::KeyGenerator.new(key, iterations: key_iter_num)
        secret = key_generator.generate_key(salt)
        sign_secret = key_generator.generate_key(signed_salt)

        encryptor = ActiveSupport::MessageEncryptor.new(secret, sign_secret, serializer: JSON)
        encryptor.decrypt_and_verify(cookie)
    end
end

# IMPORTANT - create the Plezi, route for websocket connections
Plezi.route '/ws', WebsocketController