OBUILD=ocamlbuild -use-ocamlfind
PKGS=yojson,netsys,netstring,sqlite3

all: db_service.native

db_service.native: db_service.ml
	$(OBUILD) -pkgs $(PKGS) $@

clean:
	$(OBUILD) -clean
