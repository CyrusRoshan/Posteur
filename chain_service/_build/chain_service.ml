open Db_service

let () =
  let md = Db_service.retrieve_all_emails () in
  let emails = md.emails in
  let aggregates = Hashtbl.create 20 in
  let () =
    List.iter
      (fun msg ->
        try
          let already_there = Hashtbl.find aggregates msg.from in
          Hashtbl.replace aggregates msg.from (msg.body :: already_there)
        with _ -> Hashtbl.replace aggregates msg.from [msg.body])
      emails
  in
  Hashtbl.iter
    (fun sender messages ->
      Printf.printf "sender: %s\n\nmessages follow\n\n" sender;
      List.iter
        (fun msg ->
          Printf.printf "%s\n\n" msg)
        messages)
    aggregates
