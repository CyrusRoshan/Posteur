type email_summary =
  { from: string
  ; recipients: string list
  ; subject: string
  ; body: string
  ; id: int }
type messages_dump =
  { emails: email_summary list }

let urldecode = Netencoding.Url.decode
let urlencode = Netencoding.Url.encode

let email_summary_of_yojson x =
  let from = Yojson.Basic.Util.member "from" x |> Yojson.Basic.Util.to_string in
  let recipients = Yojson.Basic.Util.(member "recipients" x |> to_list) in
  let recipients = List.map (fun x -> urldecode (Yojson.Basic.Util.to_string x)) recipients in
  let subject = Yojson.Basic.Util.(member "subject" x |> to_string |> urldecode) in
  let body = Yojson.Basic.Util.(member "body" x |> to_string |> urldecode) in
  let id = Yojson.Basic.Util.(member "id" x |> to_int) in
  { from; recipients; subject; body; id }

let email_summary_to_yojson x =
  `Assoc
    [ "from", `String x.from
    ; "recipients", `List[`Null]
    ; "subject", `String (urlencode x.subject)
    ; "body", `String (urlencode x.body) ]

let messages_dump_of_yojson x =
  { emails = Yojson.Basic.Util.(convert_each email_summary_of_yojson (member "emails" x)) }

let messages_dump_to_yojson x =
  let xs = List.map (fun msg -> email_summary_to_yojson msg) x.emails in
  `Assoc
    [ "emails", `List xs ]

let retrieve_all_emails () =
  let dbh = Sqlite3.db_open "../emails.db" in
  let sql = "SELECT * FROM emails" in
  let rval = ref [] in
  let _ =
    Sqlite3.exec_not_null_no_headers
      dbh
      (fun r ->
        rval := 
          { from = r.(1)
          ; recipients = []
          ; id = int_of_string r.(0)
          ; subject = urldecode r.(2)
          ; body = urldecode r.(3) }  :: !rval)
      sql
  in
  let _ = Sqlite3.db_close dbh in
  { emails = !rval }

let force_retrieve_all_emails () =
  let is = Unix.open_process_in "java -jar ../mailrunner.jar" in
  let yj = Yojson.Basic.from_channel is in
  let dbh = Sqlite3.db_open "../emails.db" in
  let md = messages_dump_of_yojson yj in
  let () =
    List.iter
      (fun msg ->
        let sql =
          Printf.sprintf
            "INSERT INTO emails  (id, sender, subject, body) VALUES ('%d', '%s', '%s', '%s')"
            msg.id msg.from (urlencode msg.subject) (urlencode msg.body)
        in
        let _ = Sqlite3.exec_not_null_no_headers dbh (fun _ -> ()) sql in
        ())
      md.emails
  in
  let _ = Sqlite3.db_close dbh in
  md

  (*let x = ref "" in
    let buf = Bytes.create 4096 in
    let nread = ref -1 in
    while nread <> 0 do
      let () = nread := input is buf 0 4096 in
      if !nread = 0 then () else begin
        let tmp = Bytes.init nread (fun i -> buf.[i]) in
        x := !x ^ tmp
      end
    done;
    x*)

let () =
  let force_retrieval_job = ref false in
  let show_emails = ref false in
  let speclist =
    [ "-force-retrieval-job", Arg.Set force_retrieval_job, "force the retrieval of all emails from the remote"
    ; "-show-emails", Arg.Set show_emails, "give me json of the emails" ] in
  let _ = Arg.parse speclist print_endline "Usage is certainly a thing I could add" in
  match !force_retrieval_job with
  | true ->
      let messages = force_retrieve_all_emails () in
      Printf.printf "%d\n" (List.length messages.emails)
  | false ->
  begin match !show_emails with
  | true ->
      let emails = retrieve_all_emails () in
      messages_dump_to_yojson emails |> Yojson.Basic.to_channel stdout
  | false ->
      ()
  end
